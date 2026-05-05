import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const email = payload.email?.trim().toLowerCase();
    const password = payload.password?.trim();
    const name = payload.name?.trim();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "An account already exists for that email." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await db.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "Registration requires a working database connection. Check HUMAN_INPUT_NEEDED.md if this environment has not been configured yet.",
      },
      { status: 500 }
    );
  }
}
