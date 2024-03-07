function Header() {
  return (
    <div className="flex flex-col justify-center items-center pt-8 px-8 py-4">
      <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Visualize
        </span>{' '}
        Commuter Emissions
      </h1>
      <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
        <b>By: </b>Matteo, Bryce, Justin, Harris, & Shawn
      </p>
    </div>
  );
}

export default Header;
