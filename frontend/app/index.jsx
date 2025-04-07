// index.jsx
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import LoginScreen from "../components/LoginScreen";

export default function Index() {
  return (
    <>
      <SignedIn>
        <Redirect href="/(tabs)/home" />
      </SignedIn>
      <SignedOut>
        <LoginScreen />
      </SignedOut>
    </>
  );
}