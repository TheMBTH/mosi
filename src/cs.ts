import { v4 } from "uuid";
import Node, { ActionsGenerator, Communicator } from "./node";

class CS extends Node {

  port: chrome.runtime.Port | undefined;

  defaultCommunicator = (src: string) => (dst: string): Communicator => ({
    msg: (type, arg) => {
      if (this.port) {
        this.port.postMessage({
          src,
          dst,
          t: "msg",
          type,
          arg
        });
      } else {
        console.error("Cannot send message because no port exists");
      }
    }
  })

  specialCommunicators = (src: string): { [key: string]: Communicator } => ({
    [this.id]: this.localCommunicator(src),
    self: this.localCommunicator(src)
  })

  disconnectListener = (port: chrome.runtime.Port): void => {
    this.port = undefined;
    console.error("The port to the background page has closed");
  }

  init = (actions: ActionsGenerator, subscriptions: string[] = []) => {
    this.actions = actions;
    this.subs = [this.id, "cs", ...subscriptions];
    const connectionInfo = { subs: this.subs };
    this.port = chrome.runtime.connect({name: JSON.stringify(connectionInfo)});

    this.port.onDisconnect.addListener(this.disconnectListener);
    this.port.onMessage.addListener(this.messageListener);
  }

  id: string = v4();
  net = this.communicator(this.id);
}

const node = new CS();
const id = node.id;
const init = node.init;
const net = node.net;

export { id, init, net};
