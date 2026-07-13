export function TypewriterName({ firstName, lastName }: { firstName: string; lastName: string }) {
  return (
    <h1 className="mt-5 font-black uppercase leading-[0.88] tracking-[-0.055em]">
      <span className="block text-[clamp(3.4rem,6vw,6.25rem)] text-white">
        {Array.from(firstName).map((char, index) => (
          <span key={index} className="name-char inline-block" style={{ animationDelay: `${0.1 + index * 0.08}s` }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      <span className="mt-2 block bg-gradient-to-r from-[#4569ff] via-[#6685ff] to-[#8aa0ff] bg-clip-text text-[clamp(3.2rem,5.8vw,5.9rem)] text-transparent">
        {Array.from(lastName).map((char, index) => (
          <span key={index} className="name-char inline-block" style={{ animationDelay: `${0.3 + firstName.length * 0.08 + index * 0.08}s` }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
        <span className="cursor-blink mb-[0.1em] ml-3 inline-block h-[0.75em] w-[0.12em] align-middle rounded-full bg-[#4569ff] dark:bg-[#6685ff]" />
      </span>
    </h1>
  );
}
