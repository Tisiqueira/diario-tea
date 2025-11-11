import SumRegister from "../components/app/SumRegister";
import KeyWords from "../components/app/KeyWords";
import Actions from "../components/app/Actions";
import KeyWordsFrequent from "../components/app/KeyWordsFrequent";
import RecentActivity from "../components/app/RecentActivity";

import Header from "../components/ui/header";

export default function Dashboard() {
  const keywords = {
    amor: 5,
    paciência: 3,
    brincar: 7,
    carinho: 2,
    escola: 4,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* CONTEÚDO PRINCIPAL */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <SumRegister />
          <KeyWords keywords={keywords} />
          <Actions />
        </div>

        <KeyWordsFrequent keywords={keywords} />
        <RecentActivity />
      </main>
    </div>
  );
}
