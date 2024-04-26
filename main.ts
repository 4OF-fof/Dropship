import { walk } from "jsr:@std/fs@0.221.0/walk";
import { $ } from "jsr:@david/dax@0.40.0";
import { parseArgs } from "node:util";

const parsed = parseArgs({
  options: {
    help: {
      type: "boolean",
      default: false,
      short: 'h'
    }
  },
  allowPositionals: true
});

if (parsed.values.help) {
  console.log("Help text");
  Deno.exit(0);
}

getLocalPrjList();
const hoge: string = parsed.positionals.length === 0 ? "HogeFuga" : parsed.positionals[0];
await $`echo ${hoge}`;

async function getLocalPrjList() {
  //const DSRoot = Deno.env.get("DSRoot");
  const DSRoot = "C:\\Users\\sora6\\Downloads\\hoge";
  const localProjectList: string[] = await getPrjList(DSRoot);
  const hubRepoList: string[] = await getHubPrjList();
  console.log(localProjectList);
  console.log(hubRepoList);
}

async function getHubPrjList() {
  const hubRepoList: string[] = (await $`gh repo list --json name --jq '.[].name'`.text()).split("\n");
  return hubRepoList;
}

async function getPrjList(root: string): Promise<string[]> {
  const files = walk(root);
  const prjList: string[] = [];
  for await (const file of files) {
      if (file.isDirectory && file.name == ".git") {
          prjList.push(file.path);
      }
  }
  return prjList;
}