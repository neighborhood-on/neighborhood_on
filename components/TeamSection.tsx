import Image from "next/image";

const teamMembers = [
    {
        name: "정재성",
        role: "Team Leader",
        mbti: "　　",
        oneLiner: "Lead with Vision",
        issueDate: "2025.09.01 발급",
        idNumber: "030728-3******",
        address: "경기도 시흥시",
        avatarColor: "#3b82f6",
        photoUrl: "/images/team/jjs.png", // Placeholder
        github: "https://github.com/Interludeal",
        portfolio: "https://interludeal.com",
        skills: ["지역별 게시판 구축"]
    },
    {
        name: "심재훈",
        role: "Team Member",
        mbti: "ESTJ",
        oneLiner: "Architecture is Art",
        issueDate: "2025.09.01 발급",
        idNumber: "030928-3******",
        address: "경기도 고양시",
        avatarColor: "#10b981",
        photoUrl: "/images/team/sjh.png", // Placeholder
        github: "https://github.com/J4EH00N",
        portfolio: "https://j4eh00n.com",
        skills: ["메인화면", "로그인 / 로그아웃 / 회원가입",]
    },
    {
        name: "곽민경",
        role: "Team Member",
        mbti: "ISFP",
        oneLiner: "Pixel Perfect Design",
        issueDate: "2025.09.01 발급",
        idNumber: "050214-4******",
        address: "경기도 광주시",
        avatarColor: "#f59e0b",
        photoUrl: "/images/team/kmg.png", // Placeholder
        github: "https://github.com/kkaturi14",
        portfolio: "https://kkaturi14.com",
        skills: ["PPT 작성", "DB 설계"]
    },
    {
        name: "박혜수",
        role: "Team Member",
        mbti: "ENTJ",
        oneLiner: "Creative & Dynamic",
        issueDate: "2025.09.01 발급",
        idNumber: "050113-4******",
        address: "경기도 고양시",
        avatarColor: "#8b5cf6",
        photoUrl: "/images/team/phs.png", // Placeholder
        github: "https://github.com/Pandyo",
        portfolio: "https://pandyo.com",
        skills: ["지역별 게시판 구축"]
    },
    {
        name: "정윤서",
        role: "Team Member",
        mbti: "INFJ",
        oneLiner: "Plan & Execute",
        issueDate: "2025.09.01 발급",
        idNumber: "050326-3******",
        address: "경기도 고양시",
        avatarColor: "#06b6d4",
        photoUrl: "/images/team/jys.png", // Placeholder
        github: "https://github.com/oesp91",
        portfolio: "https://oesp91.com",
        skills: ["Map API 연결"]
    },
];

export default function TeamSection() {
    return (
        <div className="radical-section" style={{ backgroundColor: '#f0f2f5' }}>
            <div className="radical-container">
                <div className="team-radical-grid">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="team-id-card-perspective">
                            <div className="team-id-card-inner">
                                {/* FRONT: Mobile ID App Style */}
                                <div className="team-id-card-front">
                                    <div className="id-card-header">
                                        <div className="id-card-logo">🇰🇷</div>
                                        <div className="id-card-title">모바일신분증</div>
                                        <div className="id-card-menu">≡</div>
                                    </div>
                                    <div className="id-card-body">
                                        <div className="id-card-photo-wrapper">
                                            <div className="id-card-photo" style={{ backgroundColor: member.avatarColor }}>
                                                {member.name[0]}
                                            </div>
                                        </div>
                                        <div className="id-card-info">
                                            <div className="id-card-name">{member.name}</div>
                                            <div className="id-card-subtitle">주민등록증</div>
                                        </div>
                                    </div>
                                </div>

                                {/* BACK: Detailed Info (Physical Card Style) */}
                                <div className="team-id-card-back">
                                    <div className="real-id-card">
                                        <div className="real-id-header">주민등록증</div>
                                        <div className="real-id-body-row">
                                            {/* Left: Photo */}
                                            <div className="real-id-photo-area">
                                                <div className="real-id-img-placeholder" style={{ position: 'relative', overflow: 'hidden' }}>
                                                    <Image
                                                        src={member.photoUrl}
                                                        alt={member.name}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Right: Personal Details */}
                                            <div className="real-id-info-col">
                                                <div className="id-name-row" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <div className="real-id-name-large">{member.name}</div>
                                                    <span className="mbti-badge">{member.mbti}</span>
                                                </div>
                                                <div className="real-id-oneliner">"{member.oneLiner}"</div>
                                                <div className="real-id-number-row">{member.idNumber}</div>
                                                <div className="real-id-address-row">{member.address}</div>
                                            </div>
                                        </div>

                                        {/* Horizontal Role/Skills Section */}
                                        <div className="real-id-roles-row">
                                            <div className="role-label">담당업무</div>
                                            <div className="role-content">
                                                <span className="main-role-badge">{member.role}</span>
                                                <div className="skill-tags-row">
                                                    {member.skills.map(skill => (
                                                        <span key={skill} className="skill-tag-mini">{skill}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="real-id-footer">
                                            <div className="footer-official-group">
                                                <div className="footer-official-text">
                                                    동네ON 구청장
                                                    <div className="real-id-stamp">信</div>
                                                </div>
                                                <div className="issue-date">{member.issueDate}</div>
                                            </div>

                                            {/* Minimal Social Links */}
                                            <div className="real-id-socials">
                                                <a href={member.github} target="_blank" title="GitHub" className="social-icon-btn">
                                                    <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                    </svg>
                                                </a>
                                                <a href={member.portfolio} target="_blank" title="Portfolio" className="social-icon-btn">
                                                    <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    ))}
                </div>
            </div >
        </div >
    )
}
