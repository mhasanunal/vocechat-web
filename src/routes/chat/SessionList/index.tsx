import { FC, memo, useRef } from "react";
import { useState, useEffect } from "react";
import { ViewportList } from "react-viewport-list";
import Session from "./Session";
import DeleteChannelConfirmModal from "../../settingChannel/DeleteConfirmModal";
import InviteModal from "../../../common/component/InviteModal";
import { useAppSelector } from "../../../app/store";
export interface ChatSession {
  type: "user" | "channel";
  id: number;
  mid: number;
  unread: number;
}
type Props = {
  tempSession?: ChatSession;
};
const SessionList: FC<Props> = ({ tempSession }) => {
  const ref = useRef<HTMLUListElement | null>(null);
  const [deleteId, setDeleteId] = useState<number>();
  const [inviteChannelId, setInviteChannelId] = useState<number>();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const { channelIDs, DMs, readChannels, readUsers, channelMessage, userMessage, loginUid } =
    useAppSelector((store) => {
      return {
        loginUid: store.authData.user?.uid,
        channelIDs: store.channels.ids,
        DMs: store.userMessage.ids,
        userMessage: store.userMessage.byId,
        channelMessage: store.channelMessage,
        readChannels: store.footprint.readChannels,
        readUsers: store.footprint.readUsers
      };
    });

  useEffect(() => {
    const cSessions = channelIDs.map((id) => {
      const mids = channelMessage[id];
      if (!mids || mids.length == 0) {
        return { unreads: 0, id, type: "channel" };
      }
      // 先转换成数字，再排序
      const mid = [...mids].sort((a, b) => +a - +b).pop();
      return { id, mid, type: "channel" };
    });
    const uSessions = DMs.map((id) => {
      // console.log("adddd", id);
      const mids = userMessage[id];
      if (!mids || mids.length == 0) {
        return { unreads: 0, id, type: "user" };
      }
      // 先转换成数字，再排序
      const mid = [...mids].sort((a, b) => +a - +b).pop();
      return { type: "user", id, mid };
    });
    const temps = [...(cSessions as ChatSession[]), ...(uSessions as ChatSession[])].sort((a, b) => {
      const { mid: aMid = 0 } = a;
      const { mid: bMid = 0 } = b;
      return bMid - aMid;
    });
    // console.log("before qqqq", temps);
    const newSessions = tempSession ? [tempSession, ...temps] : temps;
    // console.log("qqqq", newSessions);
    setSessions(newSessions);
  }, [
    channelIDs,
    DMs,
    channelMessage,
    readChannels,
    readUsers,
    loginUid,
    userMessage,
    tempSession
  ]);

  return (
    <>
      <ul ref={ref} className="flex flex-col gap-0.5 p-2 overflow-auto">
        <ViewportList
          initialPrerender={10}
          viewportRef={ref}
          items={sessions}
        >
          {(s) => {
            const { type, id, mid = 0 } = s;
            const key = `${type}_${id}`;
            return (
              <Session
                key={key}
                type={type}
                id={id}
                mid={mid}
                setInviteChannelId={setInviteChannelId}
                setDeleteChannelId={setDeleteId}
              />
            );
          }}
        </ViewportList>
      </ul>
      {!!deleteId && (
        <DeleteChannelConfirmModal
          id={deleteId}
          closeModal={() => {
            setDeleteId(0);
          }}
        />
      )}
      {!!inviteChannelId && (
        <InviteModal
          type="channel"
          cid={inviteChannelId}
          closeModal={() => {
            setInviteChannelId(0);
          }}
        />
      )}
    </>
  );
};
export default memo(SessionList);
