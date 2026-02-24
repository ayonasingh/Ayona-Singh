import React from 'react'
import { BiBadgeCheck } from 'react-icons/bi'

const Frontend = () => {
    return (
        <div className="skills__content">
            <h3 className="skills__title">Mathematics Core</h3>

            <div className="skills__box">
                <div className="skills__group">
                    <div className="skills__data">
                        <BiBadgeCheck className='bx bx-badge-check' />

                        <div>
                            <h3 className="skills__name">Calculus</h3>
                            <span className="skills__level">Advanced</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <BiBadgeCheck className='bx bx-badge-check' />

                        <div>
                            <h3 className="skills__name">Linear Algebra</h3>
                            <span className="skills__level">Advanced</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <BiBadgeCheck className='bx bx-badge-check' />

                        <div>
                            <h3 className="skills__name">Statistics</h3>
                            <span className="skills__level">Intermediate</span>
                        </div>
                    </div>
                </div>

                <div className="skills__group">
                    <div className="skills__data">
                        <BiBadgeCheck className='bx bx-badge-check' />

                        <div>
                            <h3 className="skills__name">Number Theory</h3>
                            <span className="skills__level">Intermediate</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <BiBadgeCheck className='bx bx-badge-check' />

                        <div>
                            <h3 className="skills__name">Differential Equations</h3>
                            <span className="skills__level">Intermediate</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <BiBadgeCheck className='bx bx-badge-check' />

                        <div>
                            <h3 className="skills__name">Real Analysis</h3>
                            <span className="skills__level">Basic</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Frontend
