export type ContentType = "text/plain" | "text/markdown" | "vocechat/file" | "vocechat/archive";
export type ContentTypeKey = "text" | "markdown" | "file" | "archive";

export interface MuteDTO {
  add_users?: {
    uid: number;
    expired_in: number;
  }[];
  add_groups?: {
    gid: number;
    expired_in: number;
  }[];
  remove_users?: number[];
  remove_groups?: number[];
}
