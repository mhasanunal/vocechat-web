import { FC, memo } from "react";
import { NavLink } from "react-router-dom";
import Tippy from "@tippyjs/react";
import IconMessage from "../../../assets/icons/message.svg";
import IconMore from "../../../assets/icons/more.svg";
import Avatar from "../Avatar";
import useUserOperation from "../../hook/useUserOperation";
import { useAppSelector } from "../../../app/store";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

interface Props {
  uid: number;
  type?: "embed" | "card";
  cid?: number;
}

const Profile: FC<Props> = ({ uid, type = "embed", cid }) => {
  const { t } = useTranslation("member");
  const { t: ct } = useTranslation();
  const {
    canCopyEmail,
    copyEmail,
    removeFromChannel,
    canRemoveFromChannel,
    canRemove,
    removeUser
  } = useUserOperation({ uid, cid });

  const { data } = useAppSelector((store) => {
    return {
      data: store.users.byId[uid]
    };
  });

  if (!data) return null;
  // console.log("profile", data);
  const {
    name,
    email,
    avatar
    // introduction = "This guy has nothing to introduce",
  } = data;
  const isCard = type == 'card';
  const canRemoveFromServer = !isCard && canRemove;
  const hasMore = email || canRemoveFromChannel || canRemoveFromServer;
  const iconClass = `cursor-pointer flex flex-col items-center gap-1 rounded-lg w-32 text-primary-400 bg-gray-50 dark:bg-gray-800 text-sm pt-3.5 pb-3`;
  const containerClass = clsx(`flex-center flex-col gap-1 z-[99] mt-20 select-none`, isCard ? "p-4 w-[280px] bg-white dark:bg-gray-800 drop-shadow rounded-md" : "md:w-[432px]");
  return (
    <div className={containerClass}>
      <Avatar
        width={80}
        height={80}
        className="rounded-full w-20 h-20 object-cover"
        src={avatar}
        name={name}
      />
      <h2 className="text-lg select-text font-bold text-gray-900 dark:text-white">{name}</h2>
      <span className="text-sm text-gray-400 dark:text-gray-200 select-text">{email}</span>
      {/* <p className="intro">{introduction}</p> */}
      <ul className={clsx("mt-6 flex flex-col md:flex-row items-center gap-2", isCard && "pb-0.5")}>
        <NavLink to={`/chat/dm/${uid}`}>
          <li className={`${iconClass} icon chat`}>
            <IconMessage />
            <span>{t("send_msg")}</span>
          </li>
        </NavLink>
        <Tippy
          disabled={!hasMore}
          interactive
          popperOptions={{ strategy: "fixed" }}
          placement="bottom-start"
          trigger="click"
          hideOnClick={true}
          content={
            <ul className="context-menu">
              {canCopyEmail && (
                <li className="item" onClick={copyEmail.bind(undefined, email)}>
                  {t("copy_email")}
                </li>
              )}
              {canRemoveFromChannel && (
                <li className="item danger" onClick={removeFromChannel.bind(null, uid)}>
                  {t("remove_from_channel")}
                </li>
              )}
              {canRemoveFromServer && (
                <li className="item danger" onClick={removeUser.bind(null, uid)}>
                  {t("remove")}
                </li>
              )}
            </ul>
          }
        >
          <li className={`${iconClass} icon ${hasMore ? "" : "text-gray-500"}`}>
            <IconMore className={hasMore ? "fill-primary-500" : ""} />
            <span >{ct("more")}</span>
          </li>
        </Tippy>
      </ul>
    </div>
  );
};

export default memo(Profile);
