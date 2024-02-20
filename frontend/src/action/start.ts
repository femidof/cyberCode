"use server";

import fs from "fs";
import yaml from "yaml";
import path from "path"; 
import {
  KubeConfig,
  AppsV1Api,
  CoreV1Api,
  NetworkingV1Api,
} from "@kubernetes/client-node";

const kubeconfig = new KubeConfig();
kubeconfig.loadFromDefault();
const coreV1Api = kubeconfig.makeApiClient(CoreV1Api);
const appsV1Api = kubeconfig.makeApiClient(AppsV1Api);
const networkingV1Api = kubeconfig.makeApiClient(NetworkingV1Api);

// Updated utility function to handle multi-document YAML files
const readAndParseKubeYaml = (filePath: string, replId: string): Array<any> => {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const docs = yaml.parseAllDocuments(fileContent).map((doc) => {
    let docString = doc.toString();
    const regex = new RegExp(`service_name`, "g");
    docString = docString.replace(regex, replId);
    console.log(docString);
    return yaml.parse(docString);
  });
  return docs;
};

export const start = async (userId: string, replId: string) => {
  const namespace = "default";

  try {
    // TODO Error on the service.yaml file passed
    const kubeManifests = readAndParseKubeYaml(path.join(__dirname, "../lib/service.yaml"), replId);
        for (const manifest of kubeManifests) {
            switch (manifest.kind) {
                case "Deployment":
                    await appsV1Api.createNamespacedDeployment(namespace, manifest);
                    break;
                case "Service":
                    await coreV1Api.createNamespacedService(namespace, manifest);
                    break;
                case "Ingress":
                    await networkingV1Api.createNamespacedIngress(namespace, manifest);
                    break;
                default:
                    console.log(`Unsupported kind: ${manifest.kind}`);
            }
        }
       return { success: "Resources created successfully" }
  } catch (error) {
    console.error("Failed to create resources", error);
    return { error: "Failed to create resources" };
  }
};
