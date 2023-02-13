import {DATA} from './data';
export const config = {
  runtime: "edge",
};

export default async function handle(req: any, res: any) {
  const stream = new ReadableStream({
    start(controller) {
      let i = 0;

      const push = () => {
        if (i >= DATA.length) {
          controller.close();
          return;
        }
        let end = i + ~~(Math.random() * 7 + 1);
        controller.enqueue(new TextEncoder().encode(DATA.slice(i, end)));
        i = end;
        let wati = ~~(Math.random() * 1000 + 500)
        setTimeout(push, wati);
      };

      push();
    },
  });

  return new Response(stream)
}
