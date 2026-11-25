import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/923193187344"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Ahmed Mobile on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
    >
      <FaWhatsapp aria-hidden="true" className="h-8 w-8" />
    </a>
  );
}
