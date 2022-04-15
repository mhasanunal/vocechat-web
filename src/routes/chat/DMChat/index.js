// import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDebounce } from "rooks";
import Tooltip from "../../../common/component/Tooltip";
import alertIcon from "../../../assets/icons/alert.svg?url";
import pinIcon from "../../../assets/icons/pin.svg?url";
import searchIcon from "../../../assets/icons/search.svg?url";
import boardosIcon from "../../../assets/icons/app.boardos.svg?url";
import webrowseIcon from "../../../assets/icons/app.webrowse.svg?url";
import useChatScroll from "../../../common/hook/useChatScroll";
import Send from "../../../common/component/Send";
import { useReadMessageMutation } from "../../../app/services/message";
import Contact from "../../../common/component/Contact";
import Layout from "../Layout";
import { StyledHeader, StyledDMChat } from "./styled";
import { renderMessageFragment } from "../utils";
export default function DMChat({ uid = "", dropFiles = [] }) {
  const [updateReadIndex] = useReadMessageMutation();
  const updateReadDebounced = useDebounce(updateReadIndex, 300);
  console.log("dm files", dropFiles);
  // const [mids, setMids] = useState([]);
  const { msgIds, currUser, messageData, footprint, loginUid } = useSelector(
    (store) => {
      return {
        loginUid: store.authData.uid,
        footprint: store.footprint,
        currUser: store.contacts.byId[uid],
        msgIds: store.userMessage.byId[uid] || [],
        messageData: store.message,
      };
    }
  );
  const ref = useChatScroll(msgIds);

  if (!currUser) return null;
  // console.log("user msgs", msgs);
  const readIndex = footprint.readUsers[uid];
  return (
    <Layout
      to={uid}
      context="user"
      dropFiles={dropFiles}
      aside={
        <>
          <ul className="tools">
            <li className="tool">
              <img src={searchIcon} alt="opt icon" />
            </li>
            <li className="tool">
              <img src={alertIcon} alt="opt icon" />
            </li>
            <li className="tool">
              <img src={pinIcon} alt="opt icon" />
            </li>
          </ul>
          <hr className="divider" />
          <ul className="apps">
            <li className="app">
              <Tooltip tip="Webrowse" placement="left">
                <img src={webrowseIcon} alt="app icon" />
              </Tooltip>
            </li>
            <li className="app">
              <Tooltip tip="BoardOS" placement="left">
                <img src={boardosIcon} alt="app icon" />
              </Tooltip>
            </li>
          </ul>
        </>
      }
      header={
        <StyledHeader className="head">
          <Contact interactive={false} uid={currUser.uid} />
        </StyledHeader>
      }
    >
      <StyledDMChat>
        <div className="chat" ref={ref}>
          {[...msgIds]
            .sort((a, b) => {
              return Number(a) - Number(b);
            })
            .map((mid, idx) => {
              const curr = messageData[mid];
              const prev = idx == 0 ? null : messageData[msgIds[idx - 1]];
              const read = curr?.from_uid == loginUid || mid <= readIndex;
              return renderMessageFragment({
                updateReadIndex: updateReadDebounced,
                read,
                prev,
                curr,
                contextId: uid,
                context: "user",
              });
            })}
        </div>
        <Send
          key={currUser?.uid}
          context="user"
          name={currUser?.name}
          id={currUser?.uid}
        />
      </StyledDMChat>
    </Layout>
  );
}
