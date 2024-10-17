import { create } from "ipfs-http-client";
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';
import { toString } from 'uint8arrays/to-string';
import { encode } from "base-64";

const projectId = import.meta.env.PROJECT_ID_INFURA;
const projectSecret = import.meta.env.PROJECT_SECRET_INFURA;

const authString = "Basic " + encode(projectId + ":" + projectSecret);

const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
        authorization: authString,
    },
});

export const saveToIpfs = async (file: any) => {
    try {
        const res = await client.add(file)

        return res.path
    } catch(err) {
        console.log(err)
    }
};

export const getFromIpfs = async (path: string) => {
    try {
        const file = []
        for await (const chunk  of client.cat(path)) {
            file.push(chunk)
        }
        const buf = uint8ArrayConcat(file)
        return toString(buf, 'base64')
    } catch (error) {
        console.log(error)
}  
};
