import {useEffect, useState} from 'react';

type Category = {
    name: string;
    file: string;
    icon?: string;
};

type Item = {
    title: string;
    desc: string;
    tags: string[];
    img?: string;
    link: string;
};

const App = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [data, setData] = useState<Record<string, Item[]>>({});
    const [active, setActive] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 加载分类配置 & 对应数据文件
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await fetch('/config/categories.json');
                if (!res.ok) throw new Error('分类配置加载失败');
                const cats: Category[] = await res.json();
                setCategories(cats);
                setActive(cats[0]?.name);

                const entries = await Promise.all(
                    cats.map(async (cat) => {
                        const res = await fetch(`/config/${cat.file}`);
                        if (!res.ok) throw new Error(`加载 ${cat.name} 数据失败`);
                        const items: Item[] = await res.json();
                        return [cat.name, items];
                    })
                );

                setData(Object.fromEntries(entries));
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const keyword = search.toLowerCase();
    const filtered = data[active]?.filter(
        (item) =>
            item.title.toLowerCase().includes(keyword) ||
            item.desc.toLowerCase().includes(keyword) ||
            item.tags.some((tag) => tag.toLowerCase().includes(keyword))
    ) ?? [];

    if (loading) return <div className="text-center py-5">⏳ 加载中...</div>;
    if (error) return <div className="alert alert-danger text-center">错误: {error}</div>;

    return (
        <div className='container'>
            {/* 分类导航 */}
            <ul className="nav nav-pills justify-content-center mb-4">
                {categories.map((cat) => (
                    <li className="nav-item" key={cat.name}>
                        <button
                            className={`nav-link ${active === cat.name ? 'active' : ''}`}
                            onClick={() => setActive(cat.name)}
                        >
                            {cat.icon} {cat.name}
                        </button>
                    </li>
                ))}
            </ul>

            {/* 搜索栏 */}
            <div className="mb-4 d-flex justify-content-center">
                <div className="input-group w-50 shadow-sm">
                    <span className="input-group-text bg-white">🔍</span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="搜索"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* 列表 */}
            <div className="row">
                {filtered.length === 0 ? (
                    <div className="text-center text-muted">未找到匹配项</div>
                ) : (
                    filtered.map((item, idx) => (
                        <div className="col-md-4 mb-4" key={idx}>
                            <a
                                href={`${item.link}?`}
                                target="_blank"
                                rel="noopener"
                                className="text-decoration-none text-dark"
                            >
                                <div className="card h-100 shadow-sm">
                                    <img
                                        src={item.img || 'https://t.alcy.cc/moez'}
                                        className="card-img-top"
                                        alt={item.title}
                                        style={{objectFit: 'cover', height: '180px'}}
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{item.title}</h5>
                                        <p className="card-text text-muted">{item.desc}</p>
                                        <div className="mt-auto">
                                            {item.tags.map((tag, i) => (
                                                <span className="badge bg-secondary me-1" key={i}>
                                                  #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default App;