import "../../styles/FacultyDashboard.css";
import "./FacultyHeader.css";

export default function FacultyHeader(){

    return(

        <div className="faculty-header">

            <div>

                <p className="workspace">

                    FACULTY WORKSPACE

                </p>

                <h1>

                    Hello,

                    <span> Khushi Jain 👋</span>

                </h1>

                <p className="subtitle">

                    Generate papers, assignments and lesson plans with AI.

                </p>

            </div>

            <div className="header-right">

                <button>

                    + Create New

                </button>

            </div>

        </div>

    )

}