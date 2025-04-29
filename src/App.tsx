import './index.css'

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold text-center mb-8">Hello Bounce Blaster</h1>
      <canvas 
        id="game-canvas" 
        className="w-[960px] h-[720px] bg-zinc-800 border"
      />
    </div>
  )
}

export default App
