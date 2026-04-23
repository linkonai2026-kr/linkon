import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureCanonicalUserProfile } from "@/lib/linkon/users";
import { syncAllServices, toServiceSyncPayload } from "@/lib/linkon/service-sync";

export const dynamic = "force-dynamic";

interface RegisterBody {
  email: string;
  password: string;
  name: string;
  preferredService?: string;
  termsAgreed: boolean;
  marketingAgreed?: boolean;
}

export async function POST(req: Request) {
  try {
    let body: RegisterBody;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "The request body is invalid." },
        { status: 400 }
      );
    }

    const {
      email,
      password,
      name,
      preferredService,
      termsAgreed,
      marketingAgreed = false,
    } = body;

    if (!email || !password || !name || !termsAgreed) {
      return NextResponse.json(
        { error: "Name, email, password, and terms agreement are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const linkonAdmin = createAdminClient("linkon");
    const { data: createdUser, error: createError } =
      await linkonAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: name },
      });

    if (createError) {
      const isAlreadyRegistered =
        createError.message.includes("already been registered") ||
        createError.message.includes("already exists") ||
        createError.message.includes("duplicate");

      return NextResponse.json(
        {
          error: isAlreadyRegistered
            ? "This email is already registered."
            : createError.message,
        },
        { status: isAlreadyRegistered ? 409 : 400 }
      );
    }

    if (!createdUser.user) {
      return NextResponse.json(
        { error: "The account could not be created." },
        { status: 500 }
      );
    }

    const profile = await ensureCanonicalUserProfile(createdUser.user);
    const syncResults = await syncAllServices(
      toServiceSyncPayload(profile, createdUser.user, password),
      createdUser.user.id
    );

    const { error: preferenceError } = await linkonAdmin
      .from("registration_preferences")
      .upsert(
        {
          linkon_uid: createdUser.user.id,
          preferred_service: preferredService ?? null,
          terms_agreed: termsAgreed,
          terms_agreed_at: new Date().toISOString(),
          marketing_agreed: marketingAgreed,
        },
        { onConflict: "linkon_uid" }
      );

    if (preferenceError) {
      return NextResponse.json(
        {
          error: `The account was created, but preferences could not be saved: ${preferenceError.message}`,
        },
        { status: 500 }
      );
    }

    const { data: sessionData, error: sessionError } =
      await linkonAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/select-service`,
        },
      });

    if (sessionError || !sessionData?.properties?.action_link) {
      return NextResponse.json({
        ok: true,
        autoLogin: false,
        syncResults: syncResults.map((result) => ({
          service: result.service,
          success: result.success,
        })),
      });
    }

    return NextResponse.json({
      ok: true,
      autoLogin: true,
      magicLink: sessionData.properties.action_link,
      syncResults: syncResults.map((result) => ({
        service: result.service,
        success: result.success,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Registration failed due to an unexpected error.",
      },
      { status: 500 }
    );
  }
}
