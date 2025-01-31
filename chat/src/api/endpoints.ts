export const Endpoints = {
  users: "/users",
  signin: "/signin",
  register: "/register",
  friends: "/friends",
  channels: "/channels",
  friendsMessages: (username: string) => `/messages/friends/${username}`,
  channelMessages: (id: number) => `/messages/channels/${id}`,
  channelMembers: (id: number) => `/channels/member/${id}`,
  channelName: (id: number) => `/channels/name/${id}`,
  specificChannel: (id: number) => `/channels/${id}`,
};

export const QueryKeys = {
  allUsers: [Endpoints.users] as const,
  allFriends: [Endpoints.friends] as const,
  allChannels: [Endpoints.channels] as const,
  friendsMessages: (username: string) =>
    [Endpoints.friendsMessages(username)] as const,
  channelMessages: (id: number) => [Endpoints.channelMessages(id)] as const,
};
