import './index.css'

function App() {
  // わざとセミコロンを抜いたり、不要なconsole.logを入れたりする
  console.log("This should cause a lint error")
  
  const unused_variable = "This should cause another lint error"
  
  return (
    <div className="text-white bg-gray-900 flex-col min-h-screen w-full items-center justify-center flex">
      <h1 className="font-bold text-4xl mb-8 text-center">
        Hello Bounce Blaster
      </h1>
      <canvas
        id="game-canvas"
        className="border h-[720px] w-[960px] bg-zinc-800"
      />
    </div>
  )
}

export default App
