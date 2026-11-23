import { Component, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { DrivingControls } from './components/DrivingControls';
import { Scene } from './components/Scene';
import './style.css';
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
 state = { failed: false };
 static getDerivedStateFromError() { return { failed: true }; }
 render() { return this.state.failed ? <button className="retry" onClick={() => location.reload()}>加载未完成，轻触重试</button> : this.props.children; }
}
const cinematic = new URLSearchParams(location.search).get('view') !== 'orbit';
createRoot(document.getElementById('root')!).render(<Boundary>
 <main className={cinematic ? 'driver-view' : ''} aria-label={cinematic ? '驾驶者主观视角，透过挡风玻璃观看缓慢移动的地球' : '交互地月系统'}>
  <div className={cinematic ? 'cinema-frame' : 'orbit-frame'}>
   <Scene cinematic={cinematic}/>
   {cinematic && <><div className="glass-tint"/><DrivingControls/></>}
  </div>
 </main>
</Boundary>);
