import { Application, Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import getJobsCompletedCount from "./lib/getJobsCompletedCount.ts";

const app = new Application();
app.use(oakCors());
app.use(async (ctx: Context) => {
  ctx.response.body = {
    jobsCompleted: await getJobsCompletedCount()
  }
});
app.listen({ port: 8000 });
