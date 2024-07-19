from template_matching_api.db import get_db
from template_matching_api.db_model import Base


def main() -> None:
    engine = get_db()
    Base.metadata.create_all(engine)


if __name__ == '__main__':
    main()
