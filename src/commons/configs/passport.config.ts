import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// config passport
interface Config {
	GOOGLE_CLIENT_ID: string | undefined;
	GOOGLE_CLIENT_SECRET: string | undefined;
	COOKIE_SESSION_KEY1: string;
	COOKIE_SESSION_KEY2: string;
}

const config: Config = {
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	COOKIE_SESSION_KEY1: process.env.COOKIE_SESSION_KEY1 || "key1",
	COOKIE_SESSION_KEY2: process.env.COOKIE_SESSION_KEY2 || "key2",
};

// Set up Google OAuth 2.0
const AUTH_OPTIONS = {
	callbackURL: `${process.env.PRIMARY_SERVER_URL}/api/v1/auth/google/callback`,
	clientID: config.GOOGLE_CLIENT_ID,
	clientSecret: config.GOOGLE_CLIENT_SECRET,
	scope: ["email", "profile", "openid"],
};

const verifyCallback = (
	accessToken: string,
	refreshToken: string,
	profile: any,
	done: any
) => {
	// console.log("Google profile: ", profile);
	process.nextTick(() => {
		return done(null, profile);
	});
};

// Passport's Strategy and
passport.use(new GoogleStrategy(AUTH_OPTIONS, verifyCallback));
passport.serializeUser((user: any, done) => {
	done(null, user.id);
});
passport.deserializeUser((obj: any, done) => {
	done(null, obj);
});

export default passport;
