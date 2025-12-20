import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: "http://localhost:4001/graphql", token: "50098c4e74e70372dc5dd0c8dfe05a7c705d79c7", queries });
export default client;
