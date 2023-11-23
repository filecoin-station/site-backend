import { Application, Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import getFilEarned, { formatAttoFil } from "./lib/getFilEarned.ts";

const app = new Application();
app.use(oakCors());
app.use(async (ctx: Context) => {
  ctx.response.body = {
    filEarned: formatAttoFil(await getFilEarned())
  }
});
app.listen({ port: 8000 });
