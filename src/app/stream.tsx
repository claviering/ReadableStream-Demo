'use client';
import { useState, useRef } from 'react';

export default function Stream() {
  const [generatedDescs, setGeneratedDescs] = useState('');
  const ctrl = useRef<any>()

  async function postStream() {
    setGeneratedDescs('')
    if (ctrl.current) {
      ctrl.current.cancel()
    }
    const response = await fetch("/api/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    ctrl.current = reader
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedDescs((prev) => prev + chunkValue);
    }
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
