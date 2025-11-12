export default function Profile() {
  return (
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full overflow-hidden border-2 stroke-pink-700 shadow-md">
        <p className="w-4 h-4 px-1 dark:stroke-pink-500 ">LA</p>
      </div>

      <div className="ml-3">
        <h2 className="text-base font-semibold text-foreground">
          Olá, Laura Alves!
        </h2>
        <p className="text-xs text-muted-foreground">Bem-vindo de volta 👋</p>
      </div>
    </div>
  );
}
