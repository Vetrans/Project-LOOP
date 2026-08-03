import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function FooterColumn({
  title,
  links,
  onNavigate,
}) {
  const navigate = useNavigate();

  const handleClick = (link) => {
    switch (link) {

      case "Features":
        onNavigate("features");
        window.scrollTo({
          top: 0,
          behavior: "smooth",
          });
        break;

      case "Workflow":
        onNavigate("workflow");
        break;

      case "Pricing":
        onNavigate("pricing");
        window.scrollTo({
          top: 0,
          behavior: "smooth",
          });
        break;

      case "FAQ":
        onNavigate("faq");
        break;

      case "Analytics":
        navigate("/analytics");
        break;

      case "Reports":
        navigate("/reports");
        break;

      default:
        toast.info(`${link} page is coming soon.`);
    }
  };

  return (
    <div>
      <h3 className="mb-5 text-lg font-semibold text-white">
        {title}
      </h3>

      <ul className="space-y-3">
        {links.map((link) => (
          <li
            key={link}
            onClick={() => handleClick(link)}
            className="cursor-pointer text-white/60 transition hover:text-[#32E6A4]"
          >
            {link}
          </li>
        ))}
      </ul>
    </div>
  );
}