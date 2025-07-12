function EmptyNotes({ children, element = "" }) {
  return (
    <div className="text-sm -tracking-50 leading-50">
      {element}
      <p className=" bg-neutral100 border border-neutral200 p-2 text-neutral950 rounded-lg">
        {children}
      </p>
    </div>
  );
}

export default EmptyNotes;
