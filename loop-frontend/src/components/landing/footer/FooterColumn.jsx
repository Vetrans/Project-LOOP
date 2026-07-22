export default function FooterColumn({
  title,
  links,
}) {
  return (
    <div>
      <h3 className="mb-5 text-lg font-semibold text-white">
        {title}
      </h3>

      <ul className="space-y-3">
        {links.map((link) => (
          <li
            key={link}
            className="cursor-pointer text-white/60 transition hover:text-[#32E6A4]"
          >
            {link}
          </li>
        ))}
      </ul>
    </div>
  );
}