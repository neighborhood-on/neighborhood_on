import Link from 'next/link'

export default function Hero() {
    return (
        <section className="hero">
            <div className="container">
                <h1>이웃과 연결되는 새로운 일상</h1>
                <p>
                    동네 소식, 진짜 이웃과의 소통, 그리고<br />
                    우리 동네의 가치를 높이는 활동까지.
                    <br />
                    지금 바로 <strong>동네 ON</strong>에서 시작해보세요!
                </p>

                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '30px',
                    }}
                >
                    <Link
                        href="/map"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: '600px',
                            height: '60px',
                            backgroundColor: 'white',
                            color: '#333',
                            borderRadius: '30px',
                            textDecoration: 'none',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            transition: 'transform 0.2s',
                            cursor: 'pointer',
                        }}
                    >
                        지역 이동하기
                    </Link>
                </div>
            </div>
        </section>
    )
}
