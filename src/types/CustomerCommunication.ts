export type CommunicationChannel =
  | "email"
  | "phone"
  | "whatsapp"
  | "sms"
  | "meeting";

export type CommunicationDirection =
  | "inbound"
  | "outbound";

export interface CustomerCommunication {

  id: string;

  customerId: string;

  channel: CommunicationChannel;

  direction: CommunicationDirection;

  subject: string;

  message: string;

  createdBy: string;

  createdAt: any;

}
