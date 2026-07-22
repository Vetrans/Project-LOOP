import clsx from "clsx";

export default function Button({

    children,

    variant="primary",

    size="md",

    className="",

    ...props

}){

    const variants={

        primary:
        "bg-[#32E6A4] text-[#06110F] hover:bg-[#25D493] shadow-[0_10px_35px_rgba(50,230,164,.25)]",

        secondary:
        "bg-transparent border border-white/10 text-white hover:border-[#32E6A4]",

        ghost:
        "text-white hover:text-[#32E6A4]"
    };

    const sizes={

        sm:"h-10 px-5 text-sm",

        md:"h-12 px-7",

        lg:"h-14 px-9 text-lg"

    };

    return(

        <button

        {...props}

        className={clsx(

            "rounded-full font-semibold transition-all duration-300",

            variants[variant],

            sizes[size],

            className

        )}

        >

            {children}

        </button>

    );

}