export default function Badge({children}){

return(

<div
className="inline-flex items-center gap-3 rounded-full border border-[#32E6A4]/20 bg-[#132322] px-5 py-2 text-sm text-[#32E6A4]"
>

<div className="w-2 h-2 rounded-full bg-[#32E6A4]" />

{children}

</div>

);

}