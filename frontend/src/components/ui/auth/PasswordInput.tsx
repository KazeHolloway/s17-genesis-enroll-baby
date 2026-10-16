import { Eye, EyeOff, Lock } from "lucide-react";
import { useId, useState } from "react";

/* Champ mot de passe de la maquette : contrôle bordé (rayon 10px) avec
   icône à gauche, texte sans bordure à l'intérieur et œil à droite.
   Utilisé uniquement par Login et Signup. */
export function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[12px] font-medium text-muted-foreground"
      >
        {label}
      </label>
      <div className="flex items-center gap-2.5 rounded-[10px] border border-gris bg-white px-3 transition focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(27,94,82,0.12)]">
        <Lock className="h-4 w-4 shrink-0 text-[#8a938f]" aria-hidden="true" />
        <input
          id={id}
          type={show ? "text" : "password"}
          className="min-w-0 flex-1 border-0 bg-transparent px-0 py-2 text-[13px] text-anthracite outline-none placeholder:text-[#8a938f]"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="shrink-0 text-[#8a938f] transition hover:text-primary"
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
