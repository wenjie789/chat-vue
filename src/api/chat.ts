import { request } from "@/utils/request";


export const kefuList = (
    params: NetParams.UserGetCaptcha = {}
): Promise<NetReq.UserGetCaptcha> => {
    return request({
        method: "get",
        url: "/v1/chat/kefu_list",
        params,
    });
}

export const chatIds = (
    params: NetParams.UserGetCaptcha = {}
): Promise<NetReq.UserGetCaptcha> => {
    return request({
        method: "get",
        url: "/v1/chat/chat_ids",
        params,
    });
}
export const chatRecords = (
    params: NetParams.UserGetCaptcha = {}
): Promise<NetReq.UserGetCaptcha> => {
    return request({
        method: "get",
        url: "/v1/chat/chat_records",
        params,
    });
}
export const uploadAttachment = (
    params: NetParams.UserGetAttachment
  ): Promise<NetReq.UserGetAttachment> => {
    return request({
      method: "post",
      url: "/v1/attachment",
      params,
    });
  };
  