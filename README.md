## grafana-to-elk-extension

Grafana + ELK 结合使用的 Chrome 插件。

作用：

1. 添加 requestId 链接可点（保持 time range）
2. Grafana -> ELK 的 time range 适配并自动跳转

### 使用方法

1. git clone https://github.com/nswbmw/grafana-to-elk-extension.git
2. 修改 manifest.json -> content_scripts -> matches
3. Chrome 加载已解压的扩展
