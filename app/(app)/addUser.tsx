import { StatusBar } from "react-native";
import React, { useState } from "react";
import { colorScheme } from "nativewind";
import View from "@/components/View";
import Text from "@/components/Text";
import SearchBar from "@/components/SearchBar";
import { useGetUsers, User } from "@/state/queries/users/users";
import db from "@/services/db";
import { Users as IUsers, ChatList } from "@/services/db/schema";
import { eq } from "drizzle-orm";
import UserList from "@/components/list/UserList";
import { toast } from "sonner-native";

type Props = {};

const AddUser = (props: Props) => {
  const [input, setInput] = useState<string>("o");

  const [q, setQ] = useState<string>("");

  const { data, isLoading, isFetching, error } = useGetUsers({
    options: {
      q,
    },
    queryParams: {
      enabled: !!q,
    },
  });

  // const addUserToChatList = () => {};

  const addUserToChatList = async (user: User) => {
    try {
      // Check if user exists in the Users table
      const existingUser = await db
        .select()
        .from(IUsers)
        .where(eq(IUsers.id, user.id))
        .limit(1);

      if (existingUser.length === 0) {
        // User does not exist, so insert them into the Users table
        await db.insert(IUsers).values({
          id: user.id,
          email: user.email,
          username: user.username,
          created_at: user.created_at,
          last_login: user.last_login,
          updated_at: user.updated_at,
          // Set this according to your requirement or leave it empty if not needed
        });
        console.log(`User ${user.username} added to Users table`);
      }

      // Check if user is in the ChatList
      const chatListEntry = await db
        .select()
        .from(ChatList)
        .where(eq(ChatList.userId, user.id))
        .limit(1);

      if (chatListEntry.length === 0) {
        // User not in ChatList, so add them
        await db.insert(ChatList).values({
          userId: user.id,
          lastMessage: null,
          lastMessageDatetime: null,
        });
        console.log(`User ${user.username} added to ChatList`);

        toast.success("Success", {
          description: "User Added to Chat List",
          styles: {
            toast: {
              backgroundColor: colorScheme.get() == "dark" ? "#1e293b" : "#fff",
            },
          },
        });
      } else {
        toast.info("Info", {
          description: "User is already added",
          styles: {
            toast: {
              backgroundColor: colorScheme.get() == "dark" ? "#1e293b" : "#fff",
            },
          },
        });
        console.log(`User ${user.username} already exists in ChatList`);
      }
    } catch (error) {
      console.error("Error adding user to chat list:", error);
    }
  };

  return (
    <View className="bg-background flex-1 px-4">
      <StatusBar
        backgroundColor={colorScheme.get() == "dark" ? "#000" : "#fff"}
        barStyle={"dark-content"}
      />
      <SearchBar input={input} setInput={setInput} setQ={setQ} />
      <UserList
        users={!data || !data.users ? [] : data.users}
        loading={isLoading || isFetching}
        addUser={addUserToChatList}
      />
    </View>
  );
};

export default AddUser;
