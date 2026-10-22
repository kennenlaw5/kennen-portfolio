import React from 'react'

const PROFILE_FIELDS = [
    ['role', 'Senior Full-Stack Engineer'],
    ['experience', '7+ years'],
    ['location', 'Denver area'],
]

const PROFILE_FOCUS = [
    'automotive digital retail',
    'integrations at scale',
    'AI-assisted workflows',
]

const Value: React.FC<{children: string}> = ({children}) => (
    <span className="text-emerald-300">&apos;{children}&apos;</span>
)

const Punctuation: React.FC<{children: string}> = ({children}) => (
    <span className="text-slate-500">{children}</span>
)

/**
 * Decorative "code editor" card restating the hero copy; hidden from assistive technology.
 */
const HeroProfileWindow: React.FC = () => (
    <div aria-hidden="true" className="relative">
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-transparent to-violet-500/25 blur-2xl" />
        <div className="surface relative overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-rose-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-300/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                <span className="ml-3 font-mono text-xs text-slate-400">profile.ts</span>
            </div>
            <pre className="p-5 font-mono text-xs leading-relaxed text-slate-300 sm:text-sm">
                <code>
                    <span className="text-violet-300">const</span> <span className="text-sky-300">engineer</span>
                    <Punctuation>{' = {'}</Punctuation>{'\n'}
                    {PROFILE_FIELDS.map(([key, value]) => (
                        <React.Fragment key={key}>
                            {'  '}<span className="text-cyan-300">{key}</span><Punctuation>: </Punctuation>
                            <Value>{value}</Value><Punctuation>,</Punctuation>{'\n'}
                        </React.Fragment>
                    ))}
                    {'  '}<span className="text-cyan-300">focus</span><Punctuation>{': ['}</Punctuation>{'\n'}
                    {PROFILE_FOCUS.map((item) => (
                        <React.Fragment key={item}>
                            {'    '}<Value>{item}</Value><Punctuation>,</Punctuation>{'\n'}
                        </React.Fragment>
                    ))}
                    {'  '}<Punctuation>],</Punctuation>{'\n'}
                    <Punctuation>{'}'}</Punctuation>
                    {/* Hollow, muted block cursor: the convention for an unfocused editor, so it reads as background. */}
                    <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 border border-slate-500 animate-blink motion-reduce:animate-none" />
                </code>
            </pre>
        </div>
    </div>
)

export default HeroProfileWindow
