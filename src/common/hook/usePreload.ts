import { useEffect } from "react";
import dayjs from "dayjs";
import initCache, { useRehydrate } from "../../app/cache";
import { useLazyGetFavoritesQuery } from "../../app/services/message";
import { useLazyGetUsersQuery } from "../../app/services/user";
import { useLazyGetServerQuery } from "../../app/services/server";
import useStreaming from "./useStreaming";
import { useAppSelector } from "../../app/store";
import { useLazyLoadMoreMessagesQuery } from "../../app/services/message";
import useLicense from "./useLicense";
// type Props={
//   guest?:boolean
// }
let preloadChannelMsgs = false;
export default function usePreload() {
  const { isLoading: loadingLicense } = useLicense(false);
  const [preloadChannelMessages] = useLazyLoadMoreMessagesQuery();
  const { rehydrate, rehydrated } = useRehydrate();
  const {
    loginUid,
    token,
    isGuest,
    expireTime = +new Date(),
    channelMessageData,
    channelIds
  } = useAppSelector((store) => {
    return {
      channelIds: store.channels.ids,
      channelMessageData: store.channelMessage,
      loginUid: store.authData.user?.uid,
      isGuest: store.authData.guest,
      token: store.authData.token,
      expireTime: store.authData.expireTime
    };
  });
  const { setStreamingReady } = useStreaming();
  const [
    getFavorites,
    {
      isLoading: favoritesLoading,
      isSuccess: favoritesSuccess,
      isError: favoritesError,
      data: favorites
    }
  ] = useLazyGetFavoritesQuery();
  const [
    getUsers,
    { isLoading: usersLoading, isSuccess: usersSuccess, isError: usersError, data: users }
  ] = useLazyGetUsersQuery();
  const [
    getServer,
    { isLoading: serverLoading, isSuccess: serverSuccess, isError: serverError, data: server }
  ] = useLazyGetServerQuery();
  useEffect(() => {
    initCache();
    rehydrate();
    return () => {
      setStreamingReady(false);
    };
  }, []);
  // 在guest的时候 预取channel数据
  useEffect(() => {
    if (isGuest && channelIds.length > 0 && !preloadChannelMsgs) {
      const tmps = channelIds.filter((cid) => !channelMessageData[cid]);
      // console.log("preload", channelIds, tmps);
      tmps.forEach((id) => {
        if (id) {
          preloadChannelMessages({ id, limit: 50 });
        }
      });
      preloadChannelMsgs = true;
    }
  }, [channelIds, channelMessageData, isGuest]);
  useEffect(() => {
    if (rehydrated) {
      getUsers();
      getServer();
      getFavorites();
    }
  }, [rehydrated]);
  const tokenAlmostExpire = dayjs().isAfter(new Date(expireTime - 20 * 1000));
  const canStreaming = !!loginUid && rehydrated && !!token && !tokenAlmostExpire;
  // console.log("ttt", loginUid, rehydrated, token);

  useEffect(() => {
    setStreamingReady(canStreaming);
  }, [canStreaming]);

  return {
    loading: usersLoading || serverLoading || favoritesLoading || !rehydrated || loadingLicense,
    error: usersError && serverError && favoritesError,
    success: usersSuccess && serverSuccess && favoritesSuccess,
    data: {
      users,
      server,
      favorites
    }
  };
}
