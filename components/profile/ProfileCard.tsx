import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "expo-router";
import { User2Icon } from "lucide-react-native";
import { useColorScheme } from "react-native";
import { ThemedText } from "../ThemedText";

const ProfileCard = () => {
  const colorScheme = useColorScheme();

  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const { currentUser } = useUserStore();
  return (
    <Card
      variant="elevated"
      size="md"
      style={{
        backgroundColor: colors.secondaryBackground,
        borderRadius: borderRadius.md,
      }}
    >
      {currentUser ? (
        <>
          <Box className="items-center gap-8">
            <Avatar size="2xl">
              <AvatarFallbackText>
                {currentUser &&
                  currentUser.name.charAt(0) + currentUser.name.charAt(1)}
              </AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: `${currentUser?.image}`,
                }}
              />
            </Avatar>
            <VStack className="items-center">
              <Heading size="2xl" className="mb-1">
                {currentUser?.name}
              </Heading>
              <ThemedText type="default">{currentUser?.email}</ThemedText>
            </VStack>
          </Box>
          <Box className="my-5 flex-row">
            <VStack className="items-center pb-2 flex-1 border-r border-outline-300">
              <Heading size="xs">81</Heading>
              <ThemedText type="defaultSemiBold">posts</ThemedText>
            </VStack>
            <Divider
              orientation="horizontal"
              className="w-[40%] self-center bg-background-300  hidden"
            />
            <VStack className="items-center flex-1 py-0 border-r border-outline-300">
              <Heading size="xs">{currentUser?.followers ?? 0}</Heading>
              <ThemedText type="defaultSemiBold">followers </ThemedText>
            </VStack>
            <Divider
              orientation="horizontal"
              className="w-[40%] self-center bg-background-300 hidden"
            />
            <VStack className="items-center flex-1 pt-0">
              <Heading size="xs">{currentUser?.following ?? 0}</Heading>
              <ThemedText type="defaultSemiBold">following</ThemedText>
            </VStack>
          </Box>

          <Button className="py-2 px-4 rounded-xl">
            <ButtonText size="sm">Edit profile</ButtonText>
          </Button>
        </>
      ) : (
        <DefaultProfileCard />
      )}
    </Card>
  );
};

export default ProfileCard;

const DefaultProfileCard = () => {
  const colorScheme = useColorScheme();

  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const router = useRouter();

  return (
    <>
      <Box className="items-center gap-8  min-h-80 p-8">
        <Avatar size="2xl">
          <User2Icon size={48} color={colors.icon} />
        </Avatar>
        <VStack className="items-center">
          <Heading size="2xl" className="mb-1">
            Welcome!
          </Heading>
          <ThemedText type="default">
            Please login to access your profile.
          </ThemedText>
        </VStack>
      </Box>
      <Button
        action="primary"
        className="py-2 px-4 rounded-xl"
        style={{
          backgroundColor: colors.primary,
          borderRadius: borderRadius.md,
        }}
        onPress={() => router.push("/auth/Login")}
      >
        <ButtonText size="sm" style={{ color: colors.text }}>
          Login
        </ButtonText>
      </Button>
    </>
  );
};
