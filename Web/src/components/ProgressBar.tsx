interface ProgressBarProps {
  progress: number
}
export function ProgressBar({ progress }: ProgressBarProps) {
  const progressStyle = {
    width: `${
      progress <= 0 ? 0 : progress 
      && Number.isNaN(progress) ? 0 : progress 
      && progress >= 100 ? 100 : progress 
    }%`
  }
  return (
    <div className="h-3 rounded-xl bg-zinc-700 w-full mt-4">
      <div
        role="progressbar"
        aria-label="Progresso do hábitos completados nesse dia"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="h-3 rounded-xl bg-violet-600 transition-all duration-500"
        style={progressStyle}
      />
    </div>
  )
}
