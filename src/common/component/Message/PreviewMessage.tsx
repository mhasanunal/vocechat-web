import { FC } from "react";
import clsx from "clsx";
import renderContent from "./renderContent";
import Avatar from "../Avatar";
import { useAppSelector } from "../../../app/store";

interface Props {
  mid?: number;
  context?: "forward" | "pin"
}

const PreviewMessage: FC<Props> = ({ mid = 0, context }) => {
  const { msg, usersData } = useAppSelector((store) => {
    return { msg: store.message[mid], usersData: store.users.byId };
  });
  if (!msg) return null;
  const { from_uid = 0, content_type, content, thumbnail = "", properties } = msg;
  const { name, avatar } = usersData[from_uid] ?? {};
  const pinMsg = context == "pin";
  return (
    <div className={clsx(`w-full relative flex items-start gap-3 p-2 my-2 rounded-lg`, pinMsg && "max-h-64 overflow-auto overflow-x-hidden border border-solid border-gray-200 dark:border-gray-400")}>
      <div className="w-10 h-10 flex shrink-0">
        <Avatar width={40} height={40} className="rounded-full object-cover" src={avatar} name={name} />
      </div>
      <div className="w-full flex flex-col items-start">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-gray-500 text-sm">{name}</span>
        </div>
        <div className={`select-text text-gray-600 text-sm break-all whitespace-pre-wrap dark:text-white`}>
          {renderContent({
            content_type,
            content,
            thumbnail,
            from_uid,
            properties
          })}
        </div>
      </div>
    </div>
  );
};

export default PreviewMessage;
