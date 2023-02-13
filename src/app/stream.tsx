'use client';
import { useState, useRef } from 'react';

export default function Stream() {
  const [generatedDescs, setGeneratedDescs] = useState('');
  const ctrl = useRef<any>()

  function postStream() {
    setGeneratedDescs('')
    if (ctrl.current) {
      ctrl.current.cancel()
    }
    fetch('/api/stream')
      .then((response) => response.body)
      .then((rb: any) => {
        const reader = rb.getReader();
        ctrl.current = reader
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }: any) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                setGeneratedDescs((prev) => prev + new TextDecoder().decode(value));
                push();
              });
            }

            push();
          },
        });
      })
      .then((stream) =>
        new Response(stream, {
          headers: { 'Content-Type': 'text/html' },
        }).text()
      )
      .then((result) => {
        console.log('done', result);
      });
  }
  return (
    <div className="container">
        <p  onClick={postStream} className="click">
          Click Me
        </p>
        <div className='text'>
          <p>{generatedDescs}</p>
        </div>
    </div>
  );
}
