interface StatProps {
  text: string;
  value: string;
}

export default function Stat({ text, value }: StatProps) {
  return (
    <div key={text} className="flex flex-col">
      <h3 className="text-primary-normal font-mono text-xl font-bold md:text-4xl">
        {value}
      </h3>
      <p className="font-medium text-white md:text-2xl">{text}</p>
    </div>
  );
}
