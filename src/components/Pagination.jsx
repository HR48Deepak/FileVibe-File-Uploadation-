const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; 

  return (
    <div className="flex justify-center items-center gap-2">
      <button 
        className="px-3 py-1 bg-slate-200 rounded cursor-pointer disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>

      <span className="bg-slate-700 text-white px-3 py-1 rounded-3xl font-medium ">
         {currentPage} 
      </span>
         <span className="text-slate-400 font-medium">
         of {totalPages}
      </span>
      <button 
        className="px-3 py-1 bg-slate-200 rounded cursor-pointer disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};
export default Pagination;