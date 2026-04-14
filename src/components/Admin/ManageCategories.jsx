import  { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useSelector,useDispatch } from "react-redux";
import { fetchCategories,addCategory,updateCategory, } from "../../redux/category/categorySlice";
import { FiGrid, FiActivity, FiFileText, FiSearch, FiX } from "react-icons/fi";

export const ManageCategories = () => {
  const {categories, loading} = useSelector((state) => state.category )
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedCategory, setEditedCategory] = useState({ name: "", type: "" });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const submitHandler = async (data) => {
    try {
      const resultAction = await dispatch(addCategory(data));
      if (addCategory.fulfilled.match(resultAction)) {
        toast.success("Category added!");
        reset();
      }
    } catch {
      toast.error("Error adding category");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await dispatch(deleteCategory(id));
      toast.success("Category deleted");
      dispatch(fetchCategories());
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const startEditing = (cat) => {
    setEditingId(cat._id);
    setEditedCategory({ name: cat.name, type: cat.type });
  };

  const saveEdit = async (id) => {
    try {
      await dispatch(updateCategory({id,data:editedCategory}))
      toast.success("Category updated");
      setEditingId(null);
      dispatch(fetchCategories());
    } catch {
      toast.error("Failed to update category");
    }
  };

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? cat.type === filterType : true;
    return matchesSearch && matchesType;
  });

  const totalCount = categories.length;
  const incomeCount = categories.filter((c) => c.type === "income").length;
  const expenseCount = categories.filter((c) => c.type === "expense").length;

  return (
    <div className="pb-10">
      <Toaster position="top-right" reverseOrder={false} />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Category <span className="text-cyan-400">Architecture</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-md">
              Define the structural taxonomy for global financial tracking. Manage labels and classifications for all accounts.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-gray-400">
                {totalCount} DEFINED SCHEMAS
             </div>
          </div>
        </div>

        {/* SUMMARY CARDS (KPI Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "Total Managed", value: totalCount, icon: <FiGrid size={20} />, color: "from-blue-600/20 to-indigo-500/10", accent: "text-blue-400" },
            { label: "Income Nodes", value: incomeCount, icon: <FiActivity size={20} />, color: "from-emerald-600/20 to-teal-500/10", accent: "text-emerald-400" },
            { label: "Expense Nodes", value: expenseCount, icon: <FiFileText size={20} />, color: "from-rose-600/20 to-orange-500/10", accent: "text-rose-400" },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className={`p-6 rounded-3xl bg-gradient-to-br ${card.color} border border-white/5 flex items-center justify-between group shadow-xl`}
            >
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{card.label}</p>
                <h3 className="text-3xl font-bold text-white">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl bg-black/20 ${card.accent} shadow-inner`}>
                {card.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* INTERACTION HUB (Form + Filters) */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          {/* Add Category Form */}
          <motion.form
            onSubmit={handleSubmit(submitHandler)}
            className="xl:col-span-1 p-6 rounded-3xl bg-[#0d0f14]/50 border border-white/5 backdrop-blur-md space-y-5 shadow-2xl"
          >
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest border-b border-white/5 pb-3">New Category Protocol</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  System Label
                </label>
                <input
                  {...register("name", { required: "Category name is required" })}
                  className="w-full px-4 py-3 rounded-xl bg-black/20 text-white border border-white/5 focus:ring-2 focus:ring-cyan-500/20 outline-none placeholder-gray-600 transition-all font-medium text-sm"
                  placeholder="e.g. Infrastructure"
                />
                {errors.name && <p className="text-rose-400 text-[10px] mt-2 font-bold uppercase tracking-tighter">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Classification Type
                </label>
                <select
                  {...register("type", { required: "Please select a type" })}
                  className="w-full px-4 py-3 rounded-xl bg-black/20 text-white border border-white/5 focus:ring-2 focus:ring-cyan-500/20 outline-none cursor-pointer font-medium text-sm appearance-none"
                >
                  <option value="">Select Protocol</option>
                  <option value="income">Income Flow</option>
                  <option value="expense">Expense Flow</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 text-xs tracking-widest uppercase"
            >
              INITIALIZE CATEGORY
            </button>
          </motion.form>

          {/* Table / List View */}
          <div className="xl:col-span-3 space-y-6">
            {/* Search and Filters Layer */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-3xl bg-white/5 border border-white/5">
              <div className="flex-1 relative group">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search taxonomy cache..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-black/20 border border-white/5 text-sm text-gray-300 placeholder-gray-600 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none font-medium"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-6 py-3 rounded-2xl bg-black/20 border border-white/5 text-sm text-gray-400 outline-none cursor-pointer font-medium hover:text-white transition"
              >
                <option value="">Full Taxonomy</option>
                <option value="income">Income Only</option>
                <option value="expense">Expense Only</option>
              </select>
            </div>

            {/* Main Registry */}
            <div className="rounded-3xl border border-white/5 bg-[#0d0f14]/30 backdrop-blur-xl overflow-hidden shadow-2xl">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                  <p className="text-xs font-bold text-gray-600 tracking-widest uppercase">Fetching Taxonomy...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">
                        <th className="px-6 py-4">Structure Label</th>
                        <th className="px-6 py-4">Flow Classification</th>
                        <th className="px-6 py-4 text-center">Maintenance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {filteredCategories.map((cat, index) => (
                        <motion.tr
                          key={cat._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.02 }}
                          className="group hover:bg-white/[0.01] transition-colors"
                        >
                          <td className="px-6 py-4">
                            {editingId === cat._id ? (
                              <input
                                value={editedCategory.name}
                                onChange={(e) => setEditedCategory({ ...editedCategory, name: e.target.value })}
                                className="w-full p-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none ring-2 ring-cyan-500/10"
                              />
                            ) : (
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                                    {cat.name.charAt(0)}
                                 </div>
                                 <span className="font-semibold text-gray-200 group-hover:text-cyan-400 transition">{cat.name}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingId === cat._id ? (
                              <select
                                value={editedCategory.type}
                                onChange={(e) => setEditedCategory({ ...editedCategory, type: e.target.value })}
                                className="w-full p-2.5 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none"
                              >
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                              </select>
                            ) : (
                              <span className={`px-3 py-1 transparent rounded-lg text-[10px] font-bold border ${
                                cat.type === "income" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-rose-500/30 bg-rose-500/10 text-rose-400"
                              }`}>
                                {cat.type?.toUpperCase()}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              {editingId === cat._id ? (
                                <>
                                  <button onClick={() => saveEdit(cat._id)} className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition">
                                    <FiActivity size={14} />
                                  </button>
                                  <button onClick={() => setEditingId(null)} className="p-2 rounded-xl bg-white/5 text-gray-400 hover:bg-gray-700 transition">
                                    <FiX size={14} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => startEditing(cat)} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-cyan-400 hover:bg-cyan-500 hover:text-white transition shadow-lg">
                                    <FiFileText size={16} />
                                  </button>
                                  <button onClick={() => deleteCategory(cat._id)} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-rose-400 hover:bg-rose-500 hover:text-white transition shadow-lg">
                                    <FiX size={16} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

