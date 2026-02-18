import Layout from "../components/layout/Layout";

const Dashboard = () => {
  return (
    <Layout>

      <h1 className="text-3xl font-bold mb-6">
        Poverty Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-slate-800 p-4 rounded shadow">
          High Poverty: 32%
        </div>

        <div className="bg-slate-800 p-4 rounded shadow">
          Medium: 45%
        </div>

        <div className="bg-slate-800 p-4 rounded shadow">
          Low: 23%
        </div>

      </div>

    </Layout>
  );
};

export default Dashboard;
